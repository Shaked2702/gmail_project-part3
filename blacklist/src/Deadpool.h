#ifndef DEADPOOL_H
#define DEADPOOL_H
// Deadpool object wraps std::thread for future complex implementation easier modification.
#include <thread>
#include <mutex>
#include <chrono>
#include <functional>

extern std::mutex mtx; // Mutex for readers only
extern std::mutex wrt; // Mutex for readers and writers
extern int readcount; // Number of readers initialized to 0

using namespace std;

class Deadpool {
    private:
        thread t; // Thread object

    public:
        // Ctor
        Deadpool();
        // Dtor
        virtual ~Deadpool();
        // Excute function with thread (atm no arguments)
        void execute(std::function<void()> func);
};
#endif // DEADPOOL_H