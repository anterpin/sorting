function swap(a, b, arr, updater) {
  const tmp = arr[a];
  arr[a] = arr[b];
  arr[b] = tmp;
}

function bubble_sort(arr, updater) {
  for (let a = 0; a < arr.length - 1; a++) {
    for (let b = 0; b < arr.length - 1 - a; b++) {
      if (arr[b] > arr[b + 1]) {
        swap(b, b + 1, arr, updater);
      }
    }
  }
}

function comb_sort(arr, updater) {
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
      if (arr[i] > arr[sm]) {
        swap(i, sm, arr, updater);
        sorted = false;
      }
    }
  }
}

function shaker_sort(arr, updater) {
  for (let a = 1; a < arr.length; a++) {
    if (a % 2 == 1) {
      for (
        let b = Math.floor(a / 2);
        b < arr.length - 1 - Math.floor(a / 2);
        b++
      ) {
        if (arr[b] > arr[b + 1]) {
          swap(b, b + 1, arr, updater);
        }
      }
    } else {
      for (
        let b = arr.length - Math.floor(a / 2) - 1;
        b >= Math.floor((a - 1) / 2) + 1;
        b--
      ) {
        if (arr[b - 1] > arr[b]) {
          swap(b, b - 1, arr, updater);
        }
      }
    }
  }
}

function selection_sort(arr, updater) {
  for (let a = 0; a < arr.length - 1; a++) {
    let m = a;
    for (let b = a + 1; b < arr.length; b++) {
      if (arr[b] < arr[m]) {
        m = b;
      }
    }
    swap(a, m, arr, updater);
  }
}

function _merge_sort(a, b, arr, updater) {
  if (a + 1 >= b) return;
  const m = Math.floor((a + b) / 2);
  _merge_sort(a, m, arr, updater);
  _merge_sort(m, b, arr, updater);
  // merge
  const tmp = new Array(b - a);
  let i = 0;
  let bi = m;
  let ai = a;
  while (ai < m && bi < b) {
    if (arr[ai] < arr[bi]) {
      tmp[i++] = arr[ai++];
    } else {
      tmp[i++] = arr[bi++];
    }
  }
  let ci = ai != m ? ai : bi;
  for (let iter = i; iter < tmp.length; iter++) {
    tmp[iter] = arr[ci++];
  }
  for (let iter = 0; iter < tmp.length; iter++) {
    arr[a + iter] = tmp[iter];
  }
}

function merge_sort(arr, updater) {
  _merge_sort(0, arr.length, arr, updater);
}

function count_sort(arr, updater) {
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
  for (const i of arr) {
    tmp[i - min]++;
  }
  let iter = 0;
  for (let i = 0; i < tmp.length; i++) {
    for (let y = 0; y < tmp[i]; y++) {
      arr[iter++] = i + min;
    }
  }
}

function _quick_sort(a, b, arr, updater) {
  if (a + 1 >= b) return;
  const pivot = arr[b - 1];
  let location = a;
  for (let i = a; i < b - 1; i++) {
    if (arr[i] <= pivot) {
      swap(i, location, arr, updater);
      location++;
    }
  }
  swap(b - 1, location, arr);
  _quick_sort(a, location - 1, arr, updater);
  _quick_sort(location + 1, b, arr, updater);
}

function quick_sort(arr, updater) {
  _quick_sort(0, arr.length, arr, updater);
}

function _heapify(i, n, arr, updater) {
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  let max = i;
  if (left < n && arr[left] > arr[i]) {
    max = left;
  }
  if (right < n && arr[right] > arr[max]) {
    max = right;
  }
  if (max != i) {
    swap(i, max, arr, updater);
    _heapify(max, n, arr, updater);
  }
}

function heap_sort(arr, updater) {
  for (let i = Math.floor(arr.length / 2); i >= 0; i--) {
    _heapify(i, arr.length, arr, updater);
  }
  for (let i = arr.length - 1; i >= 2; i--) {
    swap(0, i, arr, updater);
    _heapify(0, i, arr, updater);
  }
  swap(0, 1, arr, updater);
}

function insertion_sort(arr, updater) {
  for (let i = 1; i < arr.length; i++) {
    for (let y = i; y > 0; y--) {
      if (arr[y] >= arr[y - 1]) {
        break;
      }
      swap(y, y - 1, arr, updater);
    }
  }
}

function shell_short(arr, updater) {
  const gaps = [701, 301, 132, 57, 23, 10, 4, 1]; // Ciura gap sequence
  for (const gap of gaps) {
    for (let offset = 0; offset < gap; offset++) {
      for (let i = offset; i < n; i += gap) {
        const tmp = arr[i];
        let j;
        for (j = i; i >= gap && a[j - gap] > tmp; j -= gap) {
          arr[j] = arr[j - gap];
        }
        arr[j] = tmp;
      }
    }
  }
}

const arr = [1, 3, 4, 6, 5, 2];
//let arr = [2, 8, 5, 3, 9, 1, 6, 12, 32, 23, 24, 15, 16, 14];

let a = arr.slice();
merge_sort(a);
console.log(a, "merge sort");
a = arr.slice();
quick_sort(a);
console.log(a, "quick sort");
a = arr.slice();
bubble_sort(a);
console.log(a, "bubble sort");
a = arr.slice();
comb_sort(a);
console.log(a, "comb sort");
a = arr.slice();
selection_sort(a);
console.log(a, "selection sort");
a = arr.slice();
count_sort(a);
console.log(a, "count sort");
a = arr.slice();
heap_sort(a);
console.log(a, "heap sort");
a = arr.slice();
insertion_sort(a);
console.log(a, "insertion sort");
a = arr.slice();
insertion_sort(a);
console.log(a, "shell sort");
