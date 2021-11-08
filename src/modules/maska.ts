import Maska from 'maska'
import { UserModule } from '~/types'

export const install: UserModule = ({ app }) => {
  app.use(Maska)
}
