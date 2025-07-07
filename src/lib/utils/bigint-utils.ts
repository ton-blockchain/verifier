/**
 * Safe BigInt to Buffer conversion utilities
 * Replacement for vulnerable bigint-buffer package
 */

/**
 * Converts a BigInt to a Buffer in big-endian format
 * @param num - The BigInt to convert
 * @param size - The size of the buffer in bytes
 * @returns Buffer containing the big-endian representation
 */
export function toBufferBE(num: bigint, size: number): Buffer {
  if (size <= 0) {
    throw new Error("Buffer size must be positive");
  }

  const hex = num.toString(16).padStart(size * 2, "0");
  if (hex.length > size * 2) {
    throw new Error(`Number ${num} is too large for ${size} bytes`);
  }

  return Buffer.from(hex, "hex");
}

/**
 * Converts a Buffer to BigInt in big-endian format
 * @param buffer - The Buffer to convert
 * @returns BigInt representation of the buffer
 */
export function toBigIntBE(buffer: Buffer): bigint {
  if (!buffer || buffer.length === 0) {
    return 0n;
  }

  const hex = buffer.toString("hex");
  return BigInt("0x" + hex);
}

/**
 * Converts a BigInt to a Buffer in little-endian format
 * @param num - The BigInt to convert
 * @param size - The size of the buffer in bytes
 * @returns Buffer containing the little-endian representation
 */
export function toBufferLE(num: bigint, size: number): Buffer {
  if (size <= 0) {
    throw new Error("Buffer size must be positive");
  }

  const hex = num.toString(16).padStart(size * 2, "0");
  if (hex.length > size * 2) {
    throw new Error(`Number ${num} is too large for ${size} bytes`);
  }

  const buffer = Buffer.from(hex, "hex");
  return buffer.reverse();
}

/**
 * Converts a Buffer to BigInt in little-endian format
 * @param buffer - The Buffer to convert
 * @returns BigInt representation of the buffer
 */
export function toBigIntLE(buffer: Buffer): bigint {
  if (!buffer || buffer.length === 0) {
    return 0n;
  }

  const reversed = Buffer.from(buffer).reverse();
  const hex = reversed.toString("hex");
  return BigInt("0x" + hex);
}
