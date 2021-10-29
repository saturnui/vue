// Original: https://github.com/GoogleChromeLabs/file-drop

const fileExtMap = new Map()
fileExtMap.set('doc', 'application/msword')
fileExtMap.set('docx', 'application/msword')
fileExtMap.set('gif', 'image/gif')
fileExtMap.set('jpeg', 'image/jpeg')
fileExtMap.set('jpg', 'image/jpeg')
fileExtMap.set('mp4', 'video/mp4')
fileExtMap.set('mpeg', 'video/mpeg')
fileExtMap.set('pdf', 'application/pdf')
fileExtMap.set('png', 'image/png')
fileExtMap.set('ppt', 'application/vnd.ms-powerpoint')
fileExtMap.set(
  'pptx',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
)
fileExtMap.set('xls', 'application/vnd.ms-excel')
fileExtMap.set(
  'xlsx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
)

const getFileType = (filename = '') => {
  const index = filename.split('.').pop()
  if (fileExtMap.has(index)) {
    return fileExtMap.get(index)
  }
  return ''
}

const traverseFileTree = async (fileDesc: FileSystemEntry, path = '') => {
  let files: File[] = []
  if (fileDesc.isFile) {
    const fileSystemFile = fileDesc as FileSystemFileEntry
    // Get file
    fileSystemFile.file(file => {
      // set type (read-only)
      // const fileType = fileDesc.type || getFileType(file.name)
      const fileType = getFileType(file.name)
      // Object.defineProperty(file, 'type', {
      //   value: fileType,
      //   writable: false,
      // })
      if (fileType) {
        files.push(file)
      }
    })
  } else if (fileDesc.isDirectory) {
    // Get folder contents
    const fileSystemDir = fileDesc as FileSystemDirectoryEntry
    const dirReader = fileSystemDir.createReader()
    dirReader.readEntries(async entries => {
      for (let i = 0; i < entries.length; i++) {
        const f = await traverseFileTree(entries[i], path + fileDesc.name + '/')
        files = files.concat(f)
      }
    })
  }
  return files
}

const _getMatchingItems = async (listArray: DataTransferItem[]) => {
  let files: File[] = []
  const fileEntries: FileSystemEntry[] = []
  for (let i = 0; i < listArray.length; i++) {
    const fileEntry = listArray[i].webkitGetAsEntry()
    if (fileEntry) {
      // fileEntry.type = listArray[i].type
      Object.assign(fileEntry, { type: listArray[i].type }) // TODO: Not sure this will work
      fileEntries.push(fileEntry)
    }
  }
  for (let i = 0; i < fileEntries.length; i++) {
    const _files = await traverseFileTree(fileEntries[i])
    files = files.concat(_files)
  }
  return files
}

// DataTransfer.items: DataTransferItemList
const getMatchingItems = async (
  list: DataTransferItemList,
  acceptVal = '',
  multiple = false
) => {
  const listArray = Array.from(list) as DataTransferItem[]
  let matchingItems = await _getMatchingItems(listArray)
  // Return the first item (or undefined) if our filter is for all files
  if (acceptVal === '') {
    return multiple ? matchingItems : [matchingItems[0]]
  }

  const acceptsVals = acceptVal.toLowerCase().split(',')
  // Split accepts values by ',' then by '/'. Trim everything & lowercase.
  const acceptsMime = acceptsVals
    .map(accept => {
      return accept.split('/').map(part => part.trim())
    })
    .filter(acceptParts => acceptParts.length === 2) // Filter invalid values

  const acceptsExtension = acceptsVals.filter(accept => accept.startsWith('.'))

  const predicate = (file: File) => {
    // 'Parse' the type.
    const fileType = getFileType(file.name)
    const [typeMain, typeSub] = fileType
      .toLowerCase()
      .split('/')
      .map((s: string) => s.trim())

    for (const [acceptMain, acceptSub] of acceptsMime) {
      // Look for an exact match, or a partial match if * is accepted, eg image/*.
      if (
        typeMain === acceptMain &&
        (acceptSub === '*' || typeSub === acceptSub)
      ) {
        return true
      }
    }

    for (const extension of acceptsExtension) {
      if (file.name.endsWith(extension)) return true
    }

    return false
  }

  matchingItems = matchingItems.filter(predicate)
  if (!multiple) {
    matchingItems = [matchingItems[0]]
  }

  return matchingItems
}

const getFileData = async (
  rawData: DataTransfer,
  accept = '',
  multiple = false
) => {
  return await getMatchingItems(rawData.items, accept, multiple)
}

// Safari and Edge don't quite support extending Event, this works around it.
const fixExtendedEvent = (
  instance: FileDropEvent,
  type: typeof FileDropEvent
) => {
  if (!(instance instanceof type)) {
    Object.setPrototypeOf(instance, type.prototype)
  }
}

export class FileDropEvent extends Event {
  _files: File[]
  _action = ''
  constructor(
    typeArg: string,
    eventInitDict: { files: File[]; action: string }
  ) {
    super(typeArg)
    fixExtendedEvent(this, FileDropEvent)
    this._files = eventInitDict.files as File[]
    this._action = eventInitDict.action || ''
  }

  get action() {
    return this._action
  }

  get files() {
    return this._files
  }
}

/*
  Example Usage.
  <vuwi-file-drop
    accept='image/*'
    multiple | undefined
    class='drop-valid|drop-invalid'
  >
  [everything in here is a drop target.]
  </vuwi-file-drop>
  dropElement.addEventListener('filedrop', (event) => console.log(event.detail))
*/
export class FileDropElement extends HTMLElement {
  _dragEnterCount = 0

  constructor() {
    super()

    // Bind
    this._onDragEnter = this._onDragEnter.bind(this)
    this._onDragLeave = this._onDragLeave.bind(this)
    this._onDrop = this._onDrop.bind(this)
    this._onPaste = this._onPaste.bind(this)

    this.addEventListener('dragover', event => event.preventDefault())
    this.addEventListener('drop', this._onDrop)
    this.addEventListener('dragenter', this._onDragEnter)
    this.addEventListener('dragend', () => this._reset())
    this.addEventListener('dragleave', this._onDragLeave)
    this.addEventListener('paste', this._onPaste)
  }

  get accept() {
    return this.getAttribute('accept') || ''
  }

  set accept(val) {
    this.setAttribute('accept', val)
  }

  get multiple() {
    return this.getAttribute('multiple')
  }

  set multiple(val) {
    this.setAttribute('multiple', val || '')
  }

  async _onDragEnter(event: DragEvent) {
    this._dragEnterCount += 1
    if (this._dragEnterCount > 1) return
    if (event.dataTransfer === null) {
      this.classList.add('drop-invalid')
      return
    }

    // We don't have data, attempt to get it and if it matches, set the correct state.
    const items = event.dataTransfer.items
    const matchingFiles = await getMatchingItems(
      items,
      this.accept,
      this.multiple !== null
    )
    let validDrop = true
    if (event.dataTransfer && event.dataTransfer.items.length) {
      validDrop = matchingFiles.length > 0 && matchingFiles[0] !== undefined
    }
    if (validDrop) {
      this.classList.add('drop-valid')
    } else {
      this.classList.add('drop-invalid')
    }
  }

  _onDragLeave() {
    this._dragEnterCount -= 1
    if (this._dragEnterCount === 0) {
      this._reset()
    }
  }

  async _onDrop(event: DragEvent) {
    event.preventDefault()
    if (event.dataTransfer === null) return
    this._reset()
    const action = 'drop'
    const files = await getFileData(
      event.dataTransfer,
      this.accept,
      this.multiple !== null
    )
    if (files === undefined) return
    this.dispatchEvent(new FileDropEvent('filedrop', { action, files }))
  }

  async _onPaste(event: ClipboardEvent) {
    const action = 'paste'
    const files = await getFileData(
      event.clipboardData as DataTransfer,
      this.accept,
      this.multiple !== undefined
    )
    if (files === undefined) return
    this.dispatchEvent(new FileDropEvent('filedrop', { action, files }))
  }

  _reset() {
    this._dragEnterCount = 0
    this.classList.remove('drop-valid')
    this.classList.remove('drop-invalid')
  }
}

customElements.define('vuwi-file-drop', FileDropElement)
