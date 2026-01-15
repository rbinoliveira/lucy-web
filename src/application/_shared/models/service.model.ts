export type ServiceModel<T = unknown> = {
  onSuccess?: (data?: T) => void
  onError?: () => void
}
