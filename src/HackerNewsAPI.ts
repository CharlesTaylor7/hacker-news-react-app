import { Observable, interval } from 'rxjs';
import { distinctUntilChanged, map, flatMap } from 'rxjs/operators';

const rootURL = 'https://hacker-news.firebaseio.com/v0';
const suffix = '.json';

export const getLatestId = (): Promise<number> =>
  fetch(`${rootURL}/maxitem${suffix}`).then(response => response.json());

export const getItem = itemId =>
  fetch(`${rootURL}/item/${itemId}${suffix}`).then(response => response.json());

export const getUpdates = () =>
  fetch(`${rootURL}/updates${suffix}`)
    .then(response => response.json())
    .then(json => json.items);

export const getRoot = async id => {
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

export const latestItem$: Observable<number> = interval(3000).pipe(
  flatMap(() => getLatestId()),
  distinctUntilChanged()
);
