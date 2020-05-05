import _package from '../package.json'

export const VERSION = _package.version;

type Whatever = {
  [args: string]: string | undefined;
}
export const MAJOR: Whatever = {
  "0": "ω",
  "1": "ζ",
  "2": "γ",
  "3": "β",
  "4": "α",
};

export const fromSemVer = (version: string) => {
  let major = version.slice(0, 1);
  let rest = version.slice(2);
  return (MAJOR[major] || "?") + rest;
};

export const _VERSION = fromSemVer(VERSION);
