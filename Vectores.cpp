// Nuevo codigo para vectores 
/* Hacer un programa que realice todas las operaciones con vectores */
#include <iostream>
#include <conio.h>
#include <cmath>
#include <vector>

using namespace std;

//Funcion para pedir datos
void pedir_datos(){
    int n, n2;

    cout << "Digite la dimencion del vector 1: ";
    cin >> n;

    double a[n];

    for (int i = 0; i < n; i++){
        cout << "Digite el elemento " << i + 1 << " :" << endl;
        cin >> a[i];
    }

    cout << "Digite la dimencion del vector 2: ";
    cin >> n2;

    double b[n2];

    for (int i = 0; i < n2; i++){
        cout << "Digite el elemento " << i + 1 << " :" << endl;
        cin >> b[i];
    }

}

//Funcion para imprimir datos
void imprimir_datos(){
    

}

// Funcion para sumar vectores
void sumar_vectores(){

    pedir_datos();




}

int main(){
    int opcion;

    do{

        cout << "Menu de operaciones con matrices:" << endl;
        cout << "1. Sumar vectores" << endl;
        cout << "2. Salir" << endl;
        cin >> opcion;
    
    }while(opcion == 3);

    if (opcion == 1){
        
        pedir_datos();
        sumar_vectores();
        imprimir_datos();

    }

    getch();
    return 0;
}