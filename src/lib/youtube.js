import { useCallback, useEffect, useState } from "react";

// Shared plumbing for YouTube players the site drives itself (background
// videos with no YouTube controls). The player is talked to through its
// postMessage API, so no YouTube script has to be loaded on the page.

export const YT_ORIGIN = "https://www.youtube-nocookie.com";

// The video id from any of the link shapes the site uses: youtu.be/ID,
// watch?v=ID, /live/ID, /shorts/ID or /embed/ID.
export const youtubeIdFrom = (url) => {
    try {
        const u = new URL(url);
        if (u.hostname.endsWith("youtu.be")) {
            return u.pathname.slice(1).split("/")[0] || null;
        }
        const v = u.searchParams.get("v");
        if (v) return v;
        const m = u.pathname.match(/\/(?:live|shorts|embed)\/([^/?#]+)/);
        return m ? m[1] : null;
    } catch {
        return null;
    }
};

// Embed url for a player we drive ourselves. A background player starts muted
// (browsers only allow autoplay without sound), loops, and hides YouTube's
// controls; `background: false` gives the normal controls with sound.
export const youtubeEmbedSrc = (id, { background = true } = {}) => {
    const params = new URLSearchParams({
        autoplay: "1",
        mute: background ? "1" : "0",
        loop: "1",
        playlist: id,
        controls: background ? "0" : "1",
        playsinline: "1",
        rel: "0",
        iv_load_policy: "3",
        disablekb: background ? "1" : "0",
        enablejsapi: "1",
    });
    return `${YT_ORIGIN}/embed/${id}?${params}`;
};

// Talks to an embedded player once its iframe has loaded. `ready` turns true
// when the player can take commands; `command(func, args)` sends one (play,
// pause, mute…). With `hideCaptions`, the captions YouTube switches on for
// muted autoplay are turned off whenever the captions module loads.
//
// `settled` turns true once the video has been playing for `settleMs`. For the
// first few seconds of playback YouTube flashes its own buttons over the
// picture even with controls off, so a background player should stay hidden
// behind its poster until then.
//
// With `seamlessLoop`, the video jumps back to the start just before it ends.
// YouTube's own loop reloads the video as a one-item playlist at the end, which
// stalls for a few seconds and flashes its buttons again.
export const useYouTubePlayer = (
    frameRef,
    loaded,
    { hideCaptions = true, settleMs = 3000, seamlessLoop = true } = {},
) => {
    const [ready, setReady] = useState(false);
    const [apiChanges, setApiChanges] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [settled, setSettled] = useState(false);

    const command = useCallback(
        (func, args = []) => {
            frameRef.current?.contentWindow?.postMessage(
                JSON.stringify({ event: "command", func, args }),
                YT_ORIGIN,
            );
        },
        [frameRef],
    );

    // The player only reports in after we announce we are listening — keep
    // announcing until it answers.
    useEffect(() => {
        const frame = frameRef.current;
        if (!loaded || !frame) {
            setReady(false);
            setPlaying(false);
            return;
        }
        let heard = false;
        let duration = 0;
        let lastRewind = 0;
        const send = (func, args = []) =>
            frame.contentWindow?.postMessage(
                JSON.stringify({ event: "command", func, args }),
                YT_ORIGIN,
            );
        const rewind = () => {
            const now = Date.now();
            if (now - lastRewind < 2000) return;
            lastRewind = now;
            send("seekTo", [0, true]);
            send("playVideo");
        };
        const onMessage = (e) => {
            if (e.source !== frame.contentWindow) return;
            heard = true;
            let data;
            try {
                data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
            } catch {
                return;
            }
            if (data?.event === "onReady" || data?.event === "initialDelivery") {
                setReady(true);
            }
            // The captions module loads a moment after the player is ready.
            if (data?.event === "onApiChange" || data?.event === "apiInfoDelivery") {
                setApiChanges((n) => n + 1);
            }
            // Player state 1 is "playing", 0 is "ended".
            const info = data?.info;
            const state =
                data?.event === "onStateChange" ? info : info?.playerState;
            if (state === 1) setPlaying(true);
            if (!seamlessLoop) return;
            if (typeof info?.duration === "number" && info.duration > 0) {
                duration = info.duration;
            }
            const nearEnd =
                duration > 2 &&
                typeof info?.currentTime === "number" &&
                info.currentTime >= duration - 0.6;
            if (state === 0 || nearEnd) rewind();
        };
        const hello = () =>
            frame.contentWindow?.postMessage(
                JSON.stringify({ event: "listening", id: "devfest", channel: "widget" }),
                YT_ORIGIN,
            );
        window.addEventListener("message", onMessage);
        hello();
        const poll = setInterval(() => (heard ? clearInterval(poll) : hello()), 250);
        const giveUp = setTimeout(() => clearInterval(poll), 10000);
        return () => {
            window.removeEventListener("message", onMessage);
            clearInterval(poll);
            clearTimeout(giveUp);
        };
    }, [loaded, frameRef, seamlessLoop]);

    useEffect(() => {
        if (!hideCaptions || !ready) return;
        command("setOption", ["captions", "track", {}]);
        command("unloadModule", ["captions"]);
        command("unloadModule", ["cc"]);
    }, [hideCaptions, ready, apiChanges, command]);

    useEffect(() => {
        if (!playing) {
            setSettled(false);
            return;
        }
        const t = setTimeout(() => setSettled(true), settleMs);
        return () => clearTimeout(t);
    }, [playing, settleMs]);

    return { ready, command, settled };
};
