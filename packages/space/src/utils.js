import md5 from 'md5';
import { Utils } from 'common';

const COLORS = [
  'rgb(16, 148, 196)',
  'rgb(11, 168, 224)',
  'rgb(9, 84, 130)',
  'rgb(12, 56, 79)',
  'rgb(102, 225, 65)',
  'rgb(0, 212, 106)',
  'rgb(2, 212, 177)',
  'rgb(255, 153, 28)',
  'rgb(255, 119, 0)',
  'rgb(166, 48, 150)',
  'rgb(191, 52, 121)',
  'rgb(250, 58, 55)',
  'rgb(255, 74, 94)',
  'rgb(255, 207, 74)',
  'rgb(254, 233, 78)',
];

export const getColor = string =>
  string ? COLORS[parseInt(md5(string), 16) % COLORS.length] : COLORS[5];

export const getTeamColor = team =>
  Utils.getAttributeValue(team, 'Color', getColor(team.slug));

export const getTeamIcon = team => {
  const iconAttribute = Utils.getAttributeValue(team, 'Icon', 'fa-users');
  return iconAttribute.indexOf('fa-') === 0
    ? iconAttribute.slice('fa-'.length)
    : iconAttribute;
};

export const buildHierarchy = name => {
  const segments = name.split('::');
  let parent = null;
  let ancestors = [];
  segments.forEach(segment => {
    const item = {
      localName: segment,
      name: parent ? `${parent.name}::${segment}` : segment,
      slug: md5(parent ? `${parent.name}::${segment}` : segment),
      parent,
      ancestors,
    };
    parent = item;
    ancestors = [...ancestors, item];
  });
  return parent;
};
