export function apiErrors(err, rename = {}) {
  const fields = {}
  Object.entries(err?.errors || {}).forEach(([key, list]) => {
    const name = rename[key] || key.split('.')[0]
    if (!fields[name]) fields[name] = Array.isArray(list) ? list[0] : String(list)
  })
  const general = Object.keys(fields).length ? '' : err?.message || 'Something went wrong. Please try again.'
  return { fields, general }
}
