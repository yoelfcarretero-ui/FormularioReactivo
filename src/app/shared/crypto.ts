// Cifra la contraseña con SHA-256 (Web Crypto API) para no mostrarla nunca en texto plano.
// Es un hash de un solo sentido: no se puede recuperar la contraseña original.
export async function cifrarPassword(password: string): Promise<string> {
  const datos = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest('SHA-256', datos);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
