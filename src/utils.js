import { fileURLToPath } from 'url'
import { dirname } from "path"

const __fliename = fileURLToPath(import.meta.url)
const __dirname = dirname(__fliename)

export default __dirname