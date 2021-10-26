// Original: https://github.com/GoogleChromeLabs/file-drop

const fileExtMap = {
  doc: 'application/msword',
  docx: 'application/msword',
  gif: 'image/gif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  mp4: 'video/mp4',
  mpeg: 'video/mpeg',
  pdf: 'application/pdf',
  png: 'image/png',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

const getFileType = (filename = '') => {
  return fileExtMap[filename.split('.').pop()] || ''
}

const traverseFileTree = (fileDesc, path) => {
  return new Promise(resolve => {
    let files = []
    path = path || ''
    if (fileDesc.isFile) {
      // Get file
      fileDesc.file(file => {
        // set type (read-only)
        const fileType = fileDesc.type || getFileType(file.name)
        Object.defineProperty(file, 'type', {
          value: fileType,
          writable: false,
        })
        if (fileType) {
          files.push(file)
        }
        resolve(files)
      })
    } else if (fileDesc.isDirectory) {
      // Get folder contents
      var dirReader = fileDesc.createReader()
      dirReader.readEntries(async entries => {
        for (var i = 0; i < entries.length; i++) {
          const f = await traverseFileTree(entries[i], path + fileDesc.name + '/')
          files = files.concat(f)
        }
        resolve(files)
      })
    }
  })
}

const _getMatchingItems = async listArray => {
  let files = []
  let fileEntries = []
  for (let i = 0; i < listArray.length; i++) {
    const fileEntry = listArray[i].webkitGetAsEntry()
    if (fileEntry) {
      fileEntry.type = listArray[i].type
      fileEntries.push(fileEntry)
    }
  }
  for (let i = 0; i < fileEntries.length; i++) {
    const _files = await traverseFileTree(fileEntries[i])
    files = files.concat(_files)
  }
  return files
}

const getMatchingItems = async (list, acceptVal, multiple) => {
  const listArray = Array.from(list)
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

  const predicate = file => {
    // 'Parse' the type.
    const [typeMain, typeSub] = file.type
      .toLowerCase()
      .split('/')
      .map(s => s.trim())

    for (const [acceptMain, acceptSub] of acceptsMime) {
      // Look for an exact match, or a partial match if * is accepted, eg image/*.
      if (typeMain === acceptMain && (acceptSub === '*' || typeSub === acceptSub)) {
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

const getFileData = async (rawData, accept, multiple) => {
  return await getMatchingItems(rawData.items, accept, multiple)
}

// Safari and Edge don't quite support extending Event, this works around it.
const fixExtendedEvent = (instance, type) => {
  if (!(instance instanceof type)) {
    Object.setPrototypeOf(instance, type.prototype)
  }
}

export class FileDropEvent extends Event {
  constructor(typeArg, eventInitDict) {
    super(typeArg, eventInitDict)
    fixExtendedEvent(this, FileDropEvent)
    this._files = eventInitDict.files
    this._action = eventInitDict.action
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
  <file-drop
    accept='image/*'
    multiple | undefined
    class='drop-valid|drop-invalid'
  >
  [everything in here is a drop target.]
  </file-drop>
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

  _onDragEnter(event) {
    this._dragEnterCount += 1
    if (this._dragEnterCount > 1) return
    if (event.dataTransfer === null) {
      this.classList.add('drop-invalid')
      return
    }

    // We don't have data, attempt to get it and if it matches, set the correct state.
    const items = event.dataTransfer.items
    const matchingFiles = getMatchingItems(items, this.accept, this.multiple !== null)
    const validDrop =
      event.dataTransfer && event.dataTransfer.items.length
        ? matchingFiles[0] !== undefined
        : // Safari doesn't give file information on drag enter, so the best we
          // can do is return valid.
          true

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

  _onDrop(event) {
    event.preventDefault()
    if (event.dataTransfer === null) return
    this._reset()
    const action = 'drop'
    getFileData(event.dataTransfer, this.accept, this.multiple !== null).then(files => {
      if (files === undefined) return
      this.dispatchEvent(new FileDropEvent('filedrop', { action, files }))
    })
  }

  _onPaste(event) {
    const action = 'paste'
    getFileData(event.clipboardData, this.accept, this.multiple !== undefined).then(files => {
      if (files === undefined) return
      this.dispatchEvent(new FileDropEvent('filedrop', { action, files }))
    })
  }

  _reset() {
    this._dragEnterCount = 0
    this.classList.remove('drop-valid')
    this.classList.remove('drop-invalid')
  }
}

customElements.define('file-drop', FileDropElement)
