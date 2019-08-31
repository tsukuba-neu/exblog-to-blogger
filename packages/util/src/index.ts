export function chomp(input: string): string {
  return input.replace(/^[ 　\n\r\t]+/, '').replace(/[ 　\n\r\t]+$/, '')
}

export async function delay(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time)
  })
}
