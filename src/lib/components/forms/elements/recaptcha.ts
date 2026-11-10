export interface RecaptchaApi {
    render(
        container: HTMLElement,
        options: {
            sitekey: string;
            callback(token: string): void;
            "expired-callback"(): void;
            "error-callback"(): void;
        }
    ): number;

    reset(widgetId?: number): void;
}

declare global {
    interface Window {
        grecaptcha?: RecaptchaApi;
        onRecaptchaLoaded?: () => void;
    }
}

let loading: Promise<RecaptchaApi> | undefined;

function isRecaptchaApi(
    value: RecaptchaApi | undefined
): value is RecaptchaApi {
    return (
        !!value &&
        typeof value.render === "function" &&
        typeof value.reset === "function"
    );
}

export function loadRecaptcha(): Promise<RecaptchaApi> {
    if (typeof window === "undefined") {
        return Promise.reject(
            new Error("reCAPTCHA can only be loaded in the browser")
        );
    }

    if (isRecaptchaApi(window.grecaptcha)) {
        return Promise.resolve(window.grecaptcha);
    }

    if (loading) return loading;

    loading = new Promise((resolve, reject) => {
        const script = document.createElement("script");

        function fail(message: string) {
            loading = undefined;
            delete window.onRecaptchaLoaded;
            script.remove();
            reject(new Error(message));
        }

        window.onRecaptchaLoaded = () => {
            const api = window.grecaptcha;
            delete window.onRecaptchaLoaded;

            if (!isRecaptchaApi(api)) {
                fail("reCAPTCHA failed to initialize");
                return;
            }

            resolve(api);
        };

        script.id = "recaptcha-script";
        script.src =
            "https://www.google.com/recaptcha/api.js" +
            "?onload=onRecaptchaLoaded&render=explicit";
        script.async = true;
        script.defer = true;
        script.onerror = () => fail("reCAPTCHA failed to load");

        document.head.appendChild(script);
    });

    return loading;
}
