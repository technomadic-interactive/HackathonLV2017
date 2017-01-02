#include <SoftwareSerial.h>

#define rxPin 2                       //Cambio de pines Rx yy Tx por medio de la librería SoftwareSerial.h
#define txPin 3                       //------------------------------------------------------------------
#define ledPin 13                     //LED indicaador 


SoftwareSerial emicSerial =  SoftwareSerial(rxPin, txPin); //definición de los pines UART


void setup()  
{
  pinMode(ledPin, OUTPUT);
  pinMode(rxPin, INPUT);
  pinMode(txPin, OUTPUT);
  
  emicSerial.begin(9600);             //inicio de comunicación Serial con Emic2

  digitalWrite(ledPin, LOW);    
  emicSerial.print('\n');             
  while (emicSerial.read() != ':');   //Espera para hacer conexión con Emic2 por Serial
  delay(10);                          
  emicSerial.flush();                 //Se drenan los datos que se tengan en la memoria de Emic2
}

void loop()  
{
  emicSerial.print('N');              //Se escirbe N seguido de la opción deseada para seleccionar el tipo de voz
  emicSerial.print("2");              //Opciones de voz van de 0 a 8
  emicSerial.print('\n');             //Al final de cada envío se manda un CR 
  emicSerial.print('L');              //Se escirbe L seguido de la opción deseada para seleccionar el lenguaje deseado              
  emicSerial.print("1");              //Opciones: 0(inglés), 1(Español Castellano), 2(Español Laatino)
  emicSerial.print('\n');
  emicSerial.print('W');              //Se escirbe W seguido de la opción deseada para seleccionar la velocidad con la que se habla
  emicSerial.print("150");            //Valores van de 75 a 600
  emicSerial.print('\n');
  emicSerial.print('V');              //Se escirbe V seguido de la opción deseada para seleccionar el volúmen        
  emicSerial.print("18");             //Valores van desde -48 a 18  
  emicSerial.print('\n');
  emicSerial.print('S');              //Se escirbe S seguido del texto a convertir a voz
  emicSerial.print("Alexa, play miusic.");  //1023 caracteres máximo
  emicSerial.print('\n');
  delay(5000);   
}



