
export function noop() {

}

export function intBetween(min, max, val) {
  return Math.floor(
    Math.min(max, Math.max(min, val))
  );
}
