import { Document } from '@contentful/rich-text-types';
import { Entry, Asset } from 'contentful';

// 活动方案模型接口定义
export interface ActivityBlueprintFields {
  // 必填字段
  title: string;
  category: string[] | string; // 可以是数组或单个字符串
  summary: string;
  rules: Document;
  procedure: Document;
  slug?: string; // 用于URL的唯一标识符，可选
  
  // 可选字段
  coverImage?: Asset;
  durationPerRound?: string;
  rounds?: string;
  participantsPerRound?: string;
  participantCriteria?: string;
  hardwareRequirements?: string | any; // 可能是字符串或Contentful对象
  softwareRequirements?: string | any; // 可能是字符串或Contentful对象
  materialsNeeded?: string | any; // 可能是字符串或Contentful对象
  rewardSuggestion?: string;
  tips?: Document;
}

// 完整活动方案类型，使用Contentful的Entry泛型
export type ActivityBlueprint = Entry<ActivityBlueprintFields>;

// 简化的活动内容模型（现有的模型，保留用于兼容性）
export interface ActivityFields {
  title: string;
  description: Document;
  date: string;
  imageUrl: string;
  category: string;
}

export type Activity = Entry<ActivityFields>; 