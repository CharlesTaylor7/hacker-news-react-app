import React, { useState, useEffect } from 'react';
import * as HN from '../HackerNewsAPI';
import Item from './Item';

const ItemById = ({ itemId }) => {
  const [item, setItem] = useState(null);
  const pendingUpdate = HN.usePendingUpdate(itemId);

  useEffect(() => {
    if (item !== null && !pendingUpdate) return;
    HN.getItem(itemId).then(setItem);
  }, [itemId, pendingUpdate]);

  return item !== null ? <Item item={item} /> : null;
};
export default ItemById;
