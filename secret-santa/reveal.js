(() => {
  // Decode URL-safe base64 into bytes.
  function urlSafeBase64Decode(input) {
    const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "===".slice((base64.length + 3) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  function parsePayload(paramName = "data") {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get(paramName);
    if (!encoded) {
      throw new Error("Missing data parameter");
    }

    const bytes = urlSafeBase64Decode(encoded);
    const text = new TextDecoder().decode(bytes);
    return JSON.parse(text);
  }

  function renderGiftee() {
    try {
      const payload = parsePayload();
      renderName("giftee", payload.receiver);
    } catch (err) {
      renderName("giftee", "Invalid or missing link data.");
      console.error(err);
    }
  }

  function renderParticipant() {
    try {
      const payload = parsePayload();
      renderName("giver", payload.giver);
    } catch (err) {
      renderName("giver", "Unknown");
      console.error(err);
    }
  }

  function renderName(nameRef, value) {
    const el = document.getElementById(nameRef);
    if (!el) {
      return;
    }
    el.textContent = value || "Unknown";
  }

  window.SecretSantaReveal = {
    parsePayload,
    renderParticipant,
    renderGiftee,
    urlSafeBase64Decode
  };

  document.addEventListener("DOMContentLoaded", () => {
    renderParticipant();
    renderGiftee();
  });
})();
