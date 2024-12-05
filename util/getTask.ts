import { ensureDir } from "@std/fs/ensure-dir";

export function requiredEnv(name: string) {
  const ret = Deno.env.get(name);
  if (ret === undefined) {
    throw new Error(`Missing required environment variable "${name}"`);
  }
  return ret;
}

export async function getTask(day: string, stage: string) {
  const cookieValue = requiredEnv("SESSION");

  const inputFile = `./inputs/day_${day}.txt`;
  const dayURL = `https://adventofcode.com/2024/day/${encodeURIComponent(day)}`;

  const headers = new Headers();
  headers.set("Cookie", `session=${cookieValue}`);
  headers.set("User-Agent", "https://github.com/Reububble/advent-of-code-2024");

  const delay = Date.UTC(2024, 11, parseInt(day), 21) - Date.now();
  if (delay > 0) {
    while (true) {
      const remaining = Date.UTC(2024, 11, parseInt(day), 21) - Date.now();
      if (remaining <= 0) {
        break;
      }
      console.log("Waiting", Math.round(remaining / 1000), "seconds");
      const delay = remaining % 1000;
      await new Promise((r) => setTimeout(r, delay));
    }
    console.log(await downloadInput(dayURL, headers, inputFile));
    Deno.exit();
  }

  const input = await Deno.readTextFile(inputFile).catch(() => downloadInput(dayURL, headers, inputFile));

  if (delay > 0) {
    console.log(input);
    Deno.exit();
  }

  headers.set(
    "content-type",
    "application/x-www-form-urlencoded",
  );

  return {
    input,
    output: async (answer: string) => {
      console.log(`Answer: ${answer}`);
      if (Deno.stdin.isTerminal() && !confirm()) {
        return;
      }
      const response = await fetch(`${dayURL}/answer`, {
        method: "POST",
        body: `level=${stage}&answer=${answer}`,
        headers,
      });
      console.log(await response.text());
    },
  };
}

async function downloadInput(dayURL: string, headers: Headers, inputFile: string) {
  console.log("downloading input");
  await ensureDir("./inputs");
  const ret = await (await fetch(`${dayURL}/input`, { headers })).text();
  await Deno.writeTextFile(inputFile, ret);
  return ret;
}
