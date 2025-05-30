#include "Deadpool.h"

std::mutex mtx; // Mutex for readers only
std::mutex wrt; // Mutex for readers and writers
int readcount = 0; // Number of readers initialized to 0

using namespace std;

// Ctor
Deadpool::Deadpool() {
    // Empty ctor - Thread created only while making execute
}
// Dtor
Deadpool::~Deadpool() {
    if (t.joinable()) {
        t.join(); // Wait for the thread to finish
    }
}

void Deadpool::execute(std::function<void()> func) {
    t = thread(func); // Start the thread with the function
    // No need to join here - will be joined in dtor.
}