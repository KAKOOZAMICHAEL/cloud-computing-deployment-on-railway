function getErrorMessage(err) {
  if (!err) return 'Unknown error';
  if (typeof err === 'string') return err;
  if (err.message && String(err.message).trim() !== '') return String(err.message);

  // AggregateError: try to surface the underlying first failure.
  if (Array.isArray(err.errors) && err.errors.length > 0) {
    try {
      const first = err.errors[0];
      if (first && (first.message || first.code || String(first) !== '[object Object]')) {
        return getErrorMessage(first);
      }
      return String(first);
    } catch {
      // ignore and fall through to generic message
    }
  }

  // Some pg errors (e.g. AggregateError) can have an empty `.message`.
  // Fall back to a more informative string representation.
  const name = err.name ? String(err.name) : 'Error';
  const code = err.code ? ` (${String(err.code)})` : '';
  const str = String(err);
  return str && str !== '[object Object]' ? str : `${name}${code}`;
}

module.exports = { getErrorMessage };

