# TOPTAL - Load testing of website(HTTP/S protocol) using JMeter

In this project you will find 2 samples for which we have done Load testing:
1) Fast website
2) Slow website

## Why use JMeter for load testing
- JMeter is open source and very matured tool.
- It is written in Java which makes it platform independent,so that we can run the same script on all platforms windows/mac/linux
- It is very easy to use! Being a pure Java desktop application, it comes ready to use with default settings.
- It can generate the great visual reports(Graph, Chart and Tree view), also reports can be exported to XML, HTML and JSON

## Installation Guide
**JMeter is pure Java desktop application, it requires a fully compliant JVM 6 or higher, so it required to install Java SE Development Kit first**

### JAVA Installation:
1) Visit http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html
2) Under 'Java SE Development Kit 8u(version)', select Accept License Agreement, then select the platform of your choice.
```
Windows:
jdk-8u(version)-windows-x64.exe

Linux:
jdk-8u(version)-linux-x64.tar.gz

Mac:
jdk-8u(version)-macosx-x64.dmg
```
3) Follow the install instructions for your specific platform:
* https://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html

4) You might also need to set the JAVA_HOME variable. If Maven fails to run or if Maven indicates a JDK is missing (or JAVA_HOME is not set), follow these instructions:
- Setting the JAVA_HOME environment variable on Windows:
  - https://confluence.atlassian.com/doc/setting-the-java_home-variable-in-windows-8895.html
- Setting JAVA_HOME environment variable on MAC OS:
  - http://www.sajeconsultants.com/how-to-set-java_home-on-mac-os-x/
- Setting JAVA_HOME environment variable on Linux:
  - https://askubuntu.com/questions/175514/how-to-set-java-home-for-java

5) After setting the variable in path, make sure Java is accessible through terminal(CLI).
- Open the terminal and type `java -v` and it should return like below:
   ```
   java version "1.8.0_291"
   Java(TM) SE Runtime Environment (build 1.8.0_291-b10)
   Java HotSpot(TM) Client VM (build 25.291-b10, mixed mode, sharing)
   ```

### JMeter Installation:
1) Go to Apache JMeter and find the Binary(`.tgz` for Linux and `.zip` for Mac/Windows) to download to your computer: http://jmeter.apache.org/download_jmeter.cgi#binaries
   ![jmeter](https://drive.google.com/uc?export=view&id=1rZ0eER-lSMEeq0fjlfVop8CM_QnwNImk)
2) Extract the .zip/.tgz file to any directory
3) Move to extracted location and move to `/bin` directory
4) To open JMeter UI tool
   - On **Windows** do open `jmeter` batch file
     ![win](https://drive.google.com/uc?export=view&id=1F6VTah1Jm1GLQ8_xzhdwiJ974x1il9iZ)
   - On **Mac/Linux** do open `jmeter` unix executable script file
     ![mac](https://drive.google.com/uc?export=view&id=1ZEa_qklpUkbBmD7qPqJoBedGtgoSYncD)
4) It will look like this:
   ![win-jmeter](https://drive.google.com/uc?export=view&id=1QfrjwBl1wWcu1czKpq4n649oXjMyHJqP)


## Description of automation tests
There are 2 `.jmx` files can be found on the project, which is doing load testing on 2 different websites. 

One website is slow and taking longer time to load while other website is loading pretty fast. 
While performing the load testing on those websites we can see the different results and at the end results are quite opposite! 

## How to run
### Setup
1) Clone the repo: `git clone https://git.toptal.com/screening/Pratik-K-Patel.git`
2) Move to Load tests: `cd "Load tests"` and you will find 2 `.jmx` files
   ![jmx-files](https://drive.google.com/uc?export=view&id=)

#### Execution via JMeter UI tool
1) Go to downloaded JMeter directory.
2) And move to `/bin` directory.
3) Open jmeter (batch for windows, or unix executable for mac/unix) file. 
4) After JMeter UI tool gets open, Click on Open button from header.
5) Navigate to project repository and then select and open particular `.jmx` file you want to test.
   ![jmx-file-select](https://drive.google.com/uc?export=view&id=)

#### Execution via JMeter CLI
1) Open terminal and move to the project repository: `cd `
2) Use this command format: `jmeter -n -t [jmx file] -l [results file] -e -o [Path to web report folder]`

   _Example:_ `jmeter` 

### HTML Report

#### Video of successful execution: 
