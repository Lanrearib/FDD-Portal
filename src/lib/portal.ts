import "server-only";
import { cookies } from "next/headers";
import { personas, type Persona, type PersonaId } from "./portal-data";

export const PERSONA_COOKIE = "fd-demo-persona";

/** The candidate whose portal is being viewed. Prototype stand-in for the signed-in session. */
export async function getPersona(): Promise<Persona> {
  const id = (await cookies()).get(PERSONA_COOKIE)?.value as PersonaId | undefined;
  return (id && personas[id]) || personas.tunde;
}
