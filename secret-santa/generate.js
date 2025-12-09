(() => {
  // URL-safe base64 encode arbitrary bytes.
  function urlSafeBase64Encode(bytes) {
    let binary = "";
    bytes.forEach(b => {
      binary += String.fromCharCode(b);
    });
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  // Cryptographically strong random bytes.
  function randomBytes(byteLength = 16) {
    const bytes = new Uint8Array(byteLength);
    crypto.getRandomValues(bytes);
    return bytes;
  }

  // Uniform random int in [0, max) using rejection sampling to avoid modulo bias.
  function randomInt(max) {
    if (!Number.isInteger(max) || max <= 0) {
      throw new Error("max must be a positive integer");
    }

    const maxUint32 = 0xffffffff;
    const limit = Math.floor((maxUint32 + 1) / max) * max;
    const buf = new Uint32Array(1);

    let value;
    do {
      crypto.getRandomValues(buf);
      value = buf[0];
    } while (value >= limit);

    return value % max;
  }

  function randomUrlToken(byteLength = 16) {
    return urlSafeBase64Encode(randomBytes(byteLength));
  }

  function secureShuffle(list) {
    const arr = [...list];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = randomInt(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function generateDerangement(participants) {
    if (!Array.isArray(participants) || participants.length < 2) {
      throw new Error("Provide at least two participants");
    }

    let receivers;
    do {
      receivers = secureShuffle(participants);
    } while (receivers.some((name, idx) => name === participants[idx]));

    return receivers;
  }

  // Build per-person reveal links with a cryptographically random nonce in the payload.
  function generateLinks(participants) {
    const receivers = generateDerangement(participants);
    const encoder = new TextEncoder();

    return participants.map((giver, idx) => {
      const payload = {
        giver,
        receiver: receivers[idx],
        nonce: randomUrlToken(16)
      };

      const encodedPayload = urlSafeBase64Encode(encoder.encode(JSON.stringify(payload)));
      const url = new URL("reveal.html", window.location.href);
      url.searchParams.set("data", encodedPayload);
      url.searchParams.set("giver",payload.giver)

      return {
        giver,
        receiver: receivers[idx],
        url: url.toString()
      };
    });
  }

  // Expose a tiny API for use in the console or other scripts.
  window.SecretSanta = {
    generateLinks,
    randomUrlToken
  };
})();
