import { NODE_ENV } from "./env.constants"

export const isProd = () => {
    return NODE_ENV !== 'production'
}