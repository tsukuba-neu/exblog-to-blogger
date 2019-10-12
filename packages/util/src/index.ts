export function chomp(input: string): string {
  return input.replace(/^\s+/, '').replace(/\s+$/, '')
}

export async function delay(time: number): Promise<void> {
  return new Promise((resolve: (v?: void) => void): void => {
    setTimeout(() => resolve(), time)
  })
}
