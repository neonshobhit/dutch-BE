#include<bits/stdc++.h>
using namespace std;

struct Cmp {
  bool operator()(pair<int, int>& a, pair<int, int>& b) {
    return a.first > b.first;
  }
} cmp;

void calculateBalance(
  vector<vector<int>>& graph,
  priority_queue<pair<int, int>, vector<pair<int, int>>, Cmp>& credit,
  priority_queue<pair<int, int>, vector<pair<int, int>>, Cmp>& debit
) {

  vector<int> balance(graph.size(), 0);

  for (int i=0; i<graph.size(); ++i) {
    int sum = 0;
    for (int j=0; j<graph[i].size(); ++j) {
      sum += graph[i][j];
    }

    // Person has to pay this much money in total.
    balance[i] -= sum;
  }

  for (int i=0; i<graph.size(); ++i) {
    int sum = 0;
    for (int j=0; j<graph[i].size(); ++j) {
      sum += graph[j][i];
    }

    // Person has to receive this much in total.
    balance[i] += sum;
  }

  for (int i=0; i<balance.size(); ++i) {
    // If finally it's positive, person will receive money, if it's negative, person will pay money.
    // If it's 0, there's no role to be played.
    if (balance[i] > 0) credit.push({balance[i], i});
    else if (balance[i] < 0) debit.push({-balance[i], i});
  }

}

void displayBalances(
  priority_queue<pair<int, int>, vector<pair<int, int>>, Cmp> credit,
  priority_queue<pair<int, int>, vector<pair<int, int>>, Cmp> debit
) {

  cout<<"\nCredit\n";
  while(!credit.empty()) {
    cout<<credit.top().second<<" : "<<credit.top().first<<"\n";
    credit.pop();
  }

  cout<<"\nDebit\n";
  while(!debit.empty()) {
    cout<<debit.top().second<<" : "<<debit.top().first<<"\n";
    debit.pop();
  }
}

void simplify (
  vector<vector<int>>& graph,
  priority_queue<pair<int, int>, vector<pair<int, int>>, Cmp>& credit,
  priority_queue<pair<int, int>, vector<pair<int, int>>, Cmp>& debit
) {

  while(!credit.empty()) {
    int c_top = credit.top().first;
    int d_top = debit.top().first;

    int c_ind = credit.top().second;
    int d_ind = debit.top().second;

    if (c_top > d_top) {
      graph[d_ind][c_ind] = d_top;

      credit.pop();
      debit.pop();

      credit.push({c_top - d_top, c_ind});
    } else if (c_top < d_top) {
      graph[d_ind][c_ind] = c_top;
      credit.pop();
      debit.pop();

      debit.push({d_top - c_top, d_ind});
    } else {
      graph[d_ind][c_ind] = d_top;
      credit.pop();
      debit.pop();
    }
  }
}

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


  cout<<"\n\n\nAfter simplification:\n";


  priority_queue<pair<int, int>, vector<pair<int, int>>, Cmp> credit;
  priority_queue<pair<int, int>, vector<pair<int, int>>, Cmp> debit;
  vector<vector<int>> simplifiedGraph(people, vector<int>(people, 0));

  // Now, calculating outflow and inflow.
  // Credit means, a person will receive money.
  // Debit means, a person will pay money.
  calculateBalance(graph, credit, debit);

  // Display the total balance sheet.
  displayBalances(credit, debit);

  // Simplification of the payment.
  simplify(simplifiedGraph, credit, debit);

  // Re assigning the graph
  graph = simplifiedGraph;

  display(graph, ind);




  return 0;
}
