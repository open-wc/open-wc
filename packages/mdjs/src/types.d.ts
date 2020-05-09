import unified from 'unified';

export type StoryTypes = 'js' | 'html';

export interface MarkdownResult {
  html: string;
  jsCode: string;
  stories: Story[];
}

export interface Story {
  key: string;
  name: string;
  code: string;
  type?: StoryTypes;
}

export interface ProcessResult {
  jsCode: string;
  allHtml: string[];
}

export interface ParseResult {
  contents: string;
  data: {
    stories: Story[];
    jsCode: string;
  };
}

export interface MdjsProcessPlugin {
  name: string;
  plugin: unified.Plugin;
  options?: unified.Settings;
}
