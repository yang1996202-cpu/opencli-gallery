export type Strategy = 'public' | 'cookie' | 'ui' | 'intercept' | 'local' | 'auto-install' | 'installed';

export interface Command {
  command: string;
  site: string;
  name: string;
  aliases: string[];
  description: string;
  access: string;
  strategy: Strategy;
  browser: boolean;
  args: Array<{
    name: string;
    type: string;
    required: boolean;
    valueRequired: boolean;
    positional: boolean;
    choices: string[];
    default: unknown;
    help: string;
  }>;
  columns: string[];
  domain: string;
  example: string;
  defaultFormat: string | null;
  siteSession: string | null;
}

export interface Site {
  site: string;
  name: string;
  emoji: string;
  category: CategoryKey;
  commands: Command[];
  strategies: Strategy[];
  commandCount: number;
  desc: string;
}

export type CategoryKey =
  | 'social'
  | 'video'
  | 'job'
  | 'shop'
  | 'news'
  | 'ai'
  | 'dev'
  | 'finance'
  | 'academic'
  | 'life'
  | 'productivity'
  | 'game'
  | 'desktop'
  | 'gov'
  | 'other';

export interface CategoryInfo {
  key: CategoryKey;
  label: string;
  icon: string;
  color: string;
}
