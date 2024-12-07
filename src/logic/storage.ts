import {useWebExtensionStorage} from '~/composables/useWebExtensionStorage'

export const doh_list_str = useWebExtensionStorage(
  'Https Over DNS Address v1',
  ''
)
