export function shortWallet (addrs, n) {
  return addrs.slice(0, n)+'...'+addrs.slice(-n)
}