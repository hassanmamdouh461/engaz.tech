interface ImportMetaEnv {
  /** FormSubmit's hashed endpoint id; see .env.example. */
  readonly PUBLIC_CONTACT_FORM_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
