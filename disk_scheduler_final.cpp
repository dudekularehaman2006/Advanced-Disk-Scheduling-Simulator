#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
#include <sstream>

using namespace std;

struct Result {
    string name;
    int totalSeek;
    double avgSeek;
    double throughput;
};

/* ===========================
   FCFS
=========================== */

Result fcfs(int head, vector<int> requests) {
    int totalSeek = 0;
    int current = head;

    for (int r : requests) {
        totalSeek += abs(current - r);
        current = r;
    }

    return {"FCFS", totalSeek,
            (double)totalSeek / requests.size(),
            (double)requests.size() / totalSeek};
}

/* ===========================
   SSTF
=========================== */

Result sstf(int head, vector<int> requests) {
    int totalSeek = 0;
    int current = head;
    vector<int> remaining = requests;

    while (!remaining.empty()) {
        int minDist = 1e9;
        int index = 0;

        for (int i = 0; i < remaining.size(); i++) {
            int dist = abs(current - remaining[i]);
            if (dist < minDist) {
                minDist = dist;
                index = i;
            }
        }

        totalSeek += abs(current - remaining[index]);
        current = remaining[index];
        remaining.erase(remaining.begin() + index);
    }

    return {"SSTF", totalSeek,
            (double)totalSeek / requests.size(),
            (double)requests.size() / totalSeek};
}

/* ===========================
   SCAN
=========================== */

Result scanAlgo(int head, vector<int> requests, int diskSize, string direction) {
    int totalSeek = 0;
    int current = head;

    vector<int> left, right;

    for (int r : requests) {
        if (r < head) left.push_back(r);
        else right.push_back(r);
    }

    sort(left.begin(), left.end());
    sort(right.begin(), right.end());

    if (direction == "right") {

        for (int r : right) {
            totalSeek += abs(current - r);
            current = r;
        }

        totalSeek += abs(current - (diskSize - 1));
        current = diskSize - 1;

        for (int i = left.size() - 1; i >= 0; i--) {
            totalSeek += abs(current - left[i]);
            current = left[i];
        }
    }
    else {

        for (int i = left.size() - 1; i >= 0; i--) {
            totalSeek += abs(current - left[i]);
            current = left[i];
        }

        totalSeek += abs(current - 0);
        current = 0;

        for (int r : right) {
            totalSeek += abs(current - r);
            current = r;
        }
    }

    return {"SCAN", totalSeek,
            (double)totalSeek / requests.size(),
            (double)requests.size() / totalSeek};
}

/* ===========================
   C-SCAN
=========================== */

Result cscan(int head, vector<int> requests, int diskSize, string direction) {
    int totalSeek = 0;
    int current = head;

    vector<int> left, right;

    for (int r : requests) {
        if (r < head) left.push_back(r);
        else right.push_back(r);
    }

    sort(left.begin(), left.end());
    sort(right.begin(), right.end());

    if (direction == "right") {

        for (int r : right) {
            totalSeek += abs(current - r);
            current = r;
        }

        totalSeek += abs(current - (diskSize - 1));
        current = diskSize - 1;

        totalSeek += abs(current - 0);   // Jump to start
        current = 0;

        for (int r : left) {
            totalSeek += abs(current - r);
            current = r;
        }
    }
    else {

        for (int i = left.size() - 1; i >= 0; i--) {
            totalSeek += abs(current - left[i]);
            current = left[i];
        }

        totalSeek += abs(current - 0);
        current = 0;

        totalSeek += abs(current - (diskSize - 1));
        current = diskSize - 1;

        for (int i = right.size() - 1; i >= 0; i--) {
            totalSeek += abs(current - right[i]);
            current = right[i];
        }
    }

    return {"C-SCAN", totalSeek,
            (double)totalSeek / requests.size(),
            (double)requests.size() / totalSeek};
}

/* ===========================
   MAIN
=========================== */

int main() {

    int diskSize, head;
    string direction;
    string inputLine;

    cout << "Enter Disk Size: ";
    cin >> diskSize;

    cout << "Enter Initial Head Position: ";
    cin >> head;

    cin.ignore();

    cout << "Enter Requests (comma or space separated): ";
    getline(cin, inputLine);

    vector<int> requests;
    stringstream ss(inputLine);
    string temp;

    while (getline(ss, temp, ',')) {
        stringstream numStream(temp);
        int num;
        while (numStream >> num) {
            requests.push_back(num);
        }
    }

    cout << "Enter Direction (right/left): ";
    cin >> direction;

    vector<Result> results;

    results.push_back(fcfs(head, requests));
    results.push_back(sstf(head, requests));
    results.push_back(scanAlgo(head, requests, diskSize, direction));
    results.push_back(cscan(head, requests, diskSize, direction));

    cout << "\n========== RESULTS ==========\n\n";

    for (auto r : results) {
        cout << r.name << "\n";
        cout << "Total Seek Time: " << r.totalSeek << "\n";
        cout << "Average Seek Time: " << r.avgSeek << "\n";
        cout << "Throughput: " << r.throughput << "\n\n";
    }

    // Find Best Algorithm
    Result best = results[0];

    for (auto r : results) {
        if (r.totalSeek < best.totalSeek)
            best = r;
    }

    cout << "====================================\n";
    cout << "Best Performing Algorithm: "
         << best.name
         << " (Minimum Seek Time = "
         << best.totalSeek << ")\n";
    cout << "====================================\n";

    return 0;
}
