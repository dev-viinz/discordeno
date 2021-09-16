/** Waits the amount of milliseconds. */
export function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve): number =>
    setTimeout((): void => {
      resolve();
    }, milliseconds)
  );
}
