import * as parser from 'html5parser';
import * as he from 'he';

const rootURL = 'https://hacker-news.firebaseio.com/v0';
const suffix = '.json';

/**
 * @returns {Promise<Item>}
 */
export async function getItem(itemId) {
  const item = await fetch(`${rootURL}/item/${itemId}${suffix}`).then(response => response.json());
  if (!item) return item;

  const ast = parser.parse(item.text);
  item.text = '';
  parser.walk(ast, { 
    enter(node) {
      if (node.type === 'Text') {
        item.text += he.decode(node.value);
      }
      if (node.name === 'p') {
        item.text += '\n'
      }
    }
  });

  return item;
}

/**
 * @returns {Promise<Item>}
 */
export async function getRoot(id) {
  while (true) {
    const item = await getItem(id);
    if (item === null) {
      return null;
    }
    if (item.parent === undefined) {
      return item;
    }
    id = item.parent;
  }
};

/**
 * A hacker news item. Could be a story, comment, poll, job listing, etc.
  * https://github.com/HackerNews/API?tab=readme-ov-file#items
 * @typedef {Object} Item
 * @property {number} id - Unique Id
 * @property {boolean} deleted - User deleted
 * @property {boolean} dead - Dead
 * @property {string} by - Username of author
 * @property {number} time - Unix timestamp
 * @property {number|null} parent - Parent id
 * @property {number|null} parent - Parent id
 * @property {poll|null} poll - Parent poll id. (Null for everything except a pollopt)
 * @property {Array<number>} kids - Children item ids.
 * @property {string|null} url - Url for top level item.
 * @property {number} score - Score
 * @property {string|null} title - Html content of title
 * @property {string|null} text - Html content of body
 * @property {Array<number>|null} parts - Ids of poll options. Not present for other kinds of items
 * @property {number} descendants - Total comment count. For stories and polls only.
 */
