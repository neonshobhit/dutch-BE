#include<bits/stdc++.h>
using namespace std;

void query(vector<vector<int>>& graph, map<int, string>& ind, int q) {
  string payee = ind[q];

  for (int i = 0; i<graph[q].size(); ++i) {
    if (graph[q][i] == 0) continue;

    cout<<payee<<" has to pay "<<ind[i]<<" INR "<<graph[q][i]<<"\n";
  }

  cout<<"\n";

  for (int i = 0; i<graph.size(); ++i) {
    if (graph[i][q] == 0) continue;

    cout<<payee<<" has to receive "<<" INR "<<graph[i][q]<<" from "<<ind[i]<<"\n";
  }

  cout<<"\n";
}

void display(vector<vector<int>>& graph, map<int, string>& ind) {
  for (int i=0; i<graph.size(); ++i) {
    cout<<i<<":   ";
    for (int j=0; j<graph[i].size(); ++j) {
      cout<<graph[i][j]<<" ";
    }

    cout<<"\n";
  }

  for (int i=0; i<graph.size(); ++i) query(graph, ind, i);
}

void dutch(vector<vector<int>>& graph, vector<vector<int>>& tr) {
  int amount = tr[0][0];
  int paidBy = tr[0][1];

  int share = amount/tr[1].size();

  for (int i=0; i<tr[1].size(); ++i) {
    if (tr[1][i] == paidBy) continue;

    int toPay = share;

    int due = graph[paidBy][tr[1][i]];
    int contri = min(due, share);

    graph[paidBy][tr[1][i]] -= contri;
    toPay -= contri;

    graph[tr[1][i]][paidBy] += toPay;
  }
}



int main() {
  int people = 4;
  // cin>>people;

  // Storing information - names.
  map<int, string> ind;
  // for (int i=0; i<people; ++i) {
  //   string s;
  //   cin>>s;
  //   ind[i] = s;
  // }

  ind[0] = "Shobhit";
  ind[1] = "Harshit";
  ind[2] = "Swapnil";
  ind[3] = "Jatin";

  vector<vector<int>> graph(people, vector<int>(people, 0));

  // [[[amount, paidBy], [to_be_divided_in]]]
  // Example:
  // 0: Shobhit
  // 1: Harshit
  // 2: Swapnil
  // 3: Jatin

  // [[[100, 0], [0,1,2,3]], [[200, 1], [1]]]
  // There are two transactions:
  // 1. 100rs paid by Shobhit, which is to be divided among all four.
  // 2. 200rs paid by Harshit, which will paid only by him.

  vector<vector<vector<int>>> transactions = {{{100, 0}, {0,1,2,3}}, {{200, 1}, {1,3}}, {{200, 2}, {1,2,3,0}}};

  for (vector<vector<int>>& tr: transactions) dutch(graph, tr);

  display(graph, ind);


  return 0;
}
