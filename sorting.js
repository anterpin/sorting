function swap(a, b, arr) {
  const tmp = arr[a];
  arr[a] = arr[b];
  arr[b] = tmp;
}
function updateHeight(i,updater,type){
  if(updater != undefined)
    updater.updateHeight(i,type);
}
async function tick(updater){
  if(updater != undefined)
    await updater.tick();
}

async function bubble_sort(arr, updater) {
  for (let a = 0; a < arr.length - 1; a++) {
    for (let b = 0; b < arr.length - 1 - a; b++) {
      updateHeight(b,updater,'looked');
      if (arr[b] > arr[b + 1]) {
        swap(b, b + 1, arr);
        updateHeight(b,updater);
        updateHeight(b+1,updater,'looked');
      }
      await tick(updater);
      updateHeight(b,updater,'unordered');
    }
    updateHeight(arr.length-a-1,updater,'ordered');
  }
  updateHeight(0,updater,'ordered');
}

async function comb_sort(arr, updater) {
  const n = arr.length;
  const shrink = 1.3;
  let gap = n;
  let sorted = false;
  while (!sorted) {
    gap = Math.floor(gap / shrink);
    if (gap <= 1) {
      sorted = true;
      gap = 1;
    }
    for (let i = 0; i < arr.length - gap; i++) {
      const sm = gap + i;
      updateHeight(sm,updater,'selected');
      updateHeight(i,updater,'looked');
      if (arr[i] > arr[sm]) {
        swap(i, sm, arr);
        await tick(updater);
        updateHeight(sm,updater);
        updateHeight(i,updater);
        sorted = false;
      }else{
        await tick(updater);
        if(sorted){
          updateHeight(sm,updater,'ordered');
          updateHeight(i,updater,'ordered');
        }else{
          updateHeight(i,updater);
          updateHeight(sm,updater);
        }
      }
    }
  }
}

async function shaker_sort(arr, updater) {
  for (let a = 1; a < arr.length; a++) {
    if (a % 2 == 1) {
      for (
        let b = Math.floor(a / 2);
        b < arr.length - 1 - Math.floor(a / 2);
        b++
      ) {
        updateHeight(b,updater,'looked');
        if (arr[b] > arr[b + 1]) {
          swap(b, b + 1, arr);
          updateHeight(b,updater);
          updateHeight(b+1,updater,'looked');
        }
        await tick(updater);
        updateHeight(b,updater,'unordered');
      }
      updateHeight(arr.length-Math.floor(a/2)-1,updater,'ordered');
    } else {
      for (
        let b = arr.length - Math.floor(a / 2) - 1;
        b >= Math.floor((a - 1) / 2) + 1;
        b--
      ) {
        updateHeight(b,updater,'looked');
        if (arr[b - 1] > arr[b]) {
          swap(b, b - 1, arr);
          updateHeight(b,updater);
          updateHeight(b-1,updater,'looked');
        }
        await tick(updater);
        updateHeight(b,updater,'unordered');
      }
      updateHeight(Math.floor(a/2)-1,updater,'ordered');
    }
  }
  updateHeight(Math.floor(arr.length/2),updater,'ordered');
  updateHeight(Math.floor(arr.length/2)+1,updater,'ordered');
  updateHeight(Math.floor(arr.length/2)-1,updater,'ordered');
}

async function selection_sort(arr, updater) {
  for (let a = 0; a < arr.length - 1; a++) {
    let m = a;
    updateHeight(m,updater,'selected');
    for (let b = a + 1; b < arr.length; b++) {
      updateHeight(b,updater,'looked');
      if (arr[b] < arr[m]) {
        updateHeight(m,updater);
        m = b;
        updateHeight(m,updater,'selected');
        await tick(updater);
        continue;
      }
      await tick(updater);
      updateHeight(b,updater);
    }
    swap(a, m, arr);
    updateHeight(m,updater);
    updateHeight(a,updater,'ordered');
  }
    updateHeight(arr.length-1,updater,'ordered');
}

async function _merge_sort(a, b, arr, updater) {
  if (a + 1 >= b) return;
  const m = Math.floor((a + b) / 2);
  await _merge_sort(a, m, arr, updater);
  await _merge_sort(m, b, arr, updater);
  // merge
  const tmp = new Array(b - a);
  let i = 0;
  let bi = m;
  let ai = a;
  while (ai < m && bi < b) {
    updateHeight(ai,updater,'selected');
    updateHeight(bi,updater,'looked');
    if (arr[ai] < arr[bi]) {
      tmp[i++] = arr[ai++];
    } else {
      tmp[i++] = arr[bi++];
    }
    await tick(updater);
    updateHeight(ai,updater);
    updateHeight(bi,updater);
  }
  let ci = ai != m ? ai : bi;
  let color = ai != m ? 'selected':'looked';
  for (let iter = i; iter < tmp.length; iter++) {
    updateHeight(ci,updater,color);
    tmp[iter] = arr[ci++];
    await tick(updater);
    updateHeight(ci-1,updater,color);
  }
  for (let iter = 0; iter < tmp.length; iter++) {
    arr[a + iter] = tmp[iter];
    if(updater != undefined)
      await updater.halfTick();
    updateHeight(a + iter,updater,'ordered');
  }
  if((b-a) == arr.length){
    return;
  }
  for (let iter = 0; iter < tmp.length; iter++) {
    arr[a + iter] = tmp[iter];
    updateHeight(a + iter,updater);
  }
}

async function merge_sort(arr, updater) {
  await _merge_sort(0, arr.length, arr, updater);
}

async function count_sort(arr, updater) {
  let max, min;
  max = min = arr[0];
  for (let i = 1; i < arr.length; i++) {
    max = Math.max(max, arr[i]);
    min = Math.min(min, arr[i]);
  }
  const tmp = new Array(max - min + 1);

  for (let i = 0; i < tmp.length; i++) {
    tmp[i] = 0;
  }
  for (let i = 0; i < arr.length; i++) {
    updateHeight(i,updater,'looked');
    tmp[arr[i] - min]++;
    await tick(updater);
    updateHeight(i,updater);
  }
  let iter = 0;
  for (let i = 0; i < tmp.length; i++) {
    for (let y = 0; y < tmp[i]; y++) {
      arr[iter++] = i + min;
      await tick(updater);
      updateHeight(iter-1,updater,'ordered');
    }
  }
}

async function _quick_sort(a, b, arr, updater) {
  if(a + 1 == b){
    updateHeight(a,updater,'ordered');
    await tick();
  }
  if (a + 1 >= b) return;
  const pivot = arr[b - 1];
  
  updateHeight(b-1,updater,'selected');

  let location = a;
  for (let i = a; i < b - 1; i++) {
    updateHeight(i,updater,'looked');
    if (arr[i] <= pivot) {
      swap(i, location, arr);
      updateHeight(location,updater,'looked');
      updateHeight(i,updater);
      await tick(updater);
      updateHeight(location,updater);
      location++;
      continue;
    } 
    await tick(updater);
    updateHeight(i,updater); 
  }
  swap(b - 1, location, arr);
  updateHeight(b-1,updater);
  updateHeight(location,updater,'ordered');
  await _quick_sort(a, location, arr, updater);
  await _quick_sort(location + 1, b, arr, updater);
}

async function quick_sort(arr, updater) {
  await _quick_sort(0, arr.length, arr, updater);
}

async function _heapify(i, n, arr, updater) {
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  let max = i;
  updateHeight(i,updater,'looked');
  if(left < n)
    updateHeight(left,updater,'looked');
  if (left < n && arr[left] > arr[i]) {
    max = left;
  }
  if(right < n)
    updateHeight(right,updater,'looked');
  if (right < n && arr[right] > arr[max]) {
    max = right;
  }
  if (max != i) {
    swap(i, max, arr);
    updateHeight(max,updater,'selected');
    await tick(updater);
    updateHeight(i,updater,'looked');
    await _heapify(max, n, arr, updater);
  }else{
    await tick(updater);
    updateHeight(i,updater,'looked');
  } 
}

async function heap_sort(arr, updater) {
  for (let i = Math.floor(arr.length / 2); i >= 0; i--) {
    await _heapify(i, arr.length, arr, updater);
  }
  for (let i = arr.length - 1; i >= 2; i--) {
    swap(0, i, arr);
    await tick(updater);
    updateHeight(i,updater,'ordered');
    await _heapify(0, i, arr, updater);
  }
  swap(0, 1, arr);
  await tick(updater);
  updateHeight(0,updater,'ordered');
  updateHeight(1,updater,'ordered');
}

async function insertion_sort(arr, updater) {
  if(arr.length == 0) return;
  updateHeight(0,updater,'ordered');
  for (let i = 1; i < arr.length; i++) {
    for (let y = i; y > 0; y--) {
      updateHeight(y,updater,'selected');
      if (arr[y] >= arr[y - 1]) {
        updateHeight(y,updater,'ordered');
        break;
      }
      swap(y, y - 1, arr);
      await tick(updater);
      updateHeight(y,updater,'ordered');
      updateHeight(y-1,updater,'selected');
    }
    updateHeight(0,updater,'ordered');
  }
}

async function shell_sort(arr, updater) {
  const gaps = [701, 301, 132, 57, 23, 10, 4, 1]; // Ciura gap sequence
  for (const gap of gaps) {
    for (let offset = 0; offset < gap; offset++) {
      for (let i = offset; i < arr.length; i += gap) {
        const tmp = arr[i];
        updateHeight(i,updater,'selected');
        let j;
        for (j = i; i >= gap && arr[j - gap] > tmp; j -= gap) {
          updateHeight(j-gap,updater,'looked');
          arr[j] = arr[j - gap];
          await tick(updater);
          updateHeight(j-gap,updater);
          if(gap == 1){
            updateHeight(j,updater,'ordered');
          }else{
            updateHeight(j,updater);
          }
          // updateHeight(j-gap,updater);
        }
        arr[j] = tmp;
        if(gap == 1){
          updateHeight(j,updater,'ordered');
        }else{
          updateHeight(j,updater)
        }
      }
    }
  }
}
