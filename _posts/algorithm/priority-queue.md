## 优先队列

一些场景下，输入源源不断地到来，我们需要收集一段时间里到来的元素中最大或者最小的 K 个元素，并处理这 K 个元素。这个问题可以使用优先队列来轻松解决。

假设需要寻找最小的 K 个元素。对于到来的每个元素，如果队列未满，可以直接将其插入。如果队列已经满了，那么需要比较当前值和优先队列中的最大值，如果小于最大值，就移除最大值，并插入该元素。

接口定义如下：

```c++
template <typename T>
class MaxPQ{
public:
    MaxPQ() = default;
    MaxPQ(int max);
    void insert(T v);
    T max();
    T del_max();
    bool empty();
    int size();
};
```

要实现前面提到的寻找到最小的 K 个元素，可以如下实现：

```c++
vector<int> min_k(const vector<int>& nums, int k){
    MaxPQ<int> max_pq;
    for(int num : nums){
        max_pq.insert(num);
        if(max_pq.size() > k){
            max_pq.del_max();
        }
    }
    vector<int> res;
    while(!max_pq.empty()){
        res.push_back(max_pq.del_max());
    }
    return res;
}
```

优先队列底层使用二叉堆实现，二叉堆分为大顶堆和小顶堆。大顶堆的根节点存放堆中最大的元素，父节点的值一定大于两个孩子。

二叉堆使用数组作为底层结构。因为二叉堆是满二叉树，如果根节点在数组中下标为 1，那么其左孩子下标为 `1*2`，右孩子下标为 `1*2+1`。由于存在这种关系，在数组中可以很方便地使用父节点的下标，得到其孩子节点，反之亦然。

优先队列的插入操作，可以将新来的元素放到数组中下一个空闲位置，然后将该节点和父节点比较，如果比父节点大，那么就和父节点调换位置。然后再次比较，直到到达根节点处。这种操作叫做上浮。

优先队列的删除，移除的是堆顶的元素。在这里即移除堆中最大的元素，那么堆顶该由那么元素的填充呢。方法是，把数组中最后一个元素放到堆顶，然后和两个孩子比较，找到值最大的孩子，如果孩子的值比父节点大，那就调换位置。如此，直到满足二叉堆的条件，即父节点和子节点的大小关系。

下面是优先队列的实现，这里实现了大顶堆。

```c++
template <typename T, typename Compare=std::less<T>>
class MaxPQ{
public:
    MaxPQ():pq(1, 0), n(0){}
    explicit MaxPQ(int max):pq(max+1, 0), n(0){}
    void insert(T v){
        if(n == pq.size()-1){
            resize(pq.size() * 2);
        }
        pq[++n] = v;
        swim(n);
    }

    T max(){
        if(empty()){
            throw out_of_range("priority queue underflow");
        }
        return pq[1];
    }
    
    T del_max(){
        T top = this->max();
        ::swap(pq[1], pq[n--]);
        sink(1);
        return top;

    }
    
    bool empty(){
        return n == 0;
    }
    
    int size(){
        return n;
    }

private:
    void swim(int k){
        while(k > 1 && less(k/2, k)){
            ::swap(pq[k], pq[k/2]);
            k = k / 2;
        }
    }

    void sink(int k){
        while(2*k <= n){
            int i = 2 * k;
            if(i < n && less(i, i+1)){
                i++;
            }
            if(!less(k, i)){
                break;
            }
            ::swap(pq[k], pq[i]);
            k = i;
        }
    }

    void resize(int cap){
        pq.resize(cap);
    }

    bool less(int a, int b, Compare cmp = Compare()){
        return cmp(pq[a], pq[b]);
    }

    vector<int> pq;
    int n; // num of element
};
```