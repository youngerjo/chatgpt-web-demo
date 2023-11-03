# ChatGPT Web Demo

A minimal ChatGPT web demo based on Next.js and Vercel AI SDK

- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [daisyUI](https://daisyui.com/)
- [OpenAI Node API Library](https://www.npmjs.com/package/openai)
- [Vercel AI SDK](https://www.npmjs.com/package/ai)

## Setup

Create `.env` file in project root and set `OPENAI_API_KEY` from [OpenAI developer console](https://platform.openai.com/account/api-keys) like this:

```
OPENAI_API_KEY=<YOUR KEY HERE>
```

## Installation

I personally recommend using [Bun](https://bun.sh/) as the bundler/package manager. To install Bun, run the following bash script:

```
$ curl -fsSL https://bun.sh/install | bash
```

Once Bun is successfully installed, you can use it just like any other package manager (e.g. npm or yarn):

```
$ bun install
```

## Run

```
$ bun dev
```

## License

MIT
