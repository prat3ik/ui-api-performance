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

#### Composite graph plugin installation:
First you need to install the plugin manager:
1) Go to https://jmeter-plugins.org/install/Install/
2) Download plugins-manager.jar and put it into lib/ext directory, then restart JMeter
3) Click "Options" and then "Plugins Manager"

Now you need to install 2 graph plugins
1) Move to "Available Plugins" and search for "Composite Timeline Graph" and install it
   ![plug1](https://drive.google.com/uc?export=view&id=1FwGUy0uykU7CEYUbELzDHrsjUBR8JhAE)
2) Also install "3 Basic Graphs" plugin
   ![plug2](https://drive.google.com/uc?export=view&id=1RWZrTwacubVK6xp99cofrOwsFeocnTKB)
3) Now to add the graph, do right click on thread group from Test plan, then Add > Listener > jp@gc - Response Time Over Times
   ![listener](https://drive.google.com/uc?export=view&id=12hEd2dAZLFRNSjQ7VLQ1UdGNAcFjMAeJ)

## Description of automation tests
There are 2 `.jmx` files can be found on the project, which is doing load testing on 2 different websites. 

One website is slow and taking longer time to load while other website is loading pretty fast. 
While performing the load testing on those websites we can see the different results, and the final output are quite opposite! 

## Explanation
#### Fast website load testing:
1) We are making request to home page of: https://www.demoblaze.com/
2) Here we have set no. of threads as 1000, which will simulate as 1000 users, and the ramp-up period is 15 sec, it means at every single second new 1000/15=~67 users will be accessing the home page
3) To see the response performace we have added graph views, which will give exact idea regarding response time for the website under test over period of time (here 15 sec)
#### Slow website load testing:
Here we are making request to home page of: http://testscenario.com/ and the rest of steps would remain same


## How to run
### Setup

1) Clone the repo: `git clone https://git.toptal.com/screening/Pratik-K-Patel.git`
2) Move to Load tests: `cd "Load tests"` and you will find 2 `.jmx` files
   ![jmx-files](https://drive.google.com/uc?export=view&id=1QSUUn2xYfopEsZg6LPVJMz4GkFA24A49)

#### Execution via JMeter UI tool
1) Go to downloaded JMeter directory.
2) And move to `/bin` directory.
3) Open JMeter (batch for windows, or unix executable for mac/unix) file. 
4) After JMeter UI tool gets open, Click on Open button from header.
5) Navigate to project repository and then select and open particular `.jmx` file you want to test.
   ![jmx-file-select](https://drive.google.com/uc?export=view&id=1VGYo7IRS-V4L0o9VGMtpP803DGjw_9er)
6) It will look like this
   ![jmeter](https://drive.google.com/uc?export=view&id=1lCNxwxSM-wxfznyZQ99IGkovOiGivg1o)
7) You can run it by multiple ways, but simplest would be clicking on green play button
   ![play btn](https://drive.google.com/uc?export=view&id=1nDzS1Ofo_BTYg9HNEgNCdg9akvVhNqDY)
8) You can see the response graph for all the requests, as you can see the response time is being increased over time.
   ![responseselect](https://drive.google.com/uc?export=view&id=1WK2W4BRdUnybVxSBIOmEJpZFSlR38qQd)

### Q&A
#### 1) Did the load test have an impact on web application response time?
Mostly yes, however it depends on the website under test as well! 
For the website which has decent server the response time doesn't generally change with normal increase of the users, but for the slow website the response time can increase with even normal increase of users.

For slow website(http://testscenario.com) from the response over times graph we can clearly see that initially site takes less time to respond, but as time passes and new users increases the response time of the website increases drastically!
![graph](https://drive.google.com/uc?export=view&id=1UTG_zjjqxElN9VQQmXNXNNsyc76WgRXp)

#### 2) What is the optimal application response time for modern day web applications?
Ideally response time under 1000ms (1sec) can be considered as pretty good! We have done basic testing on the home page of the following websites with singe user couple of times and noted average response time(it also includes latency time):
- Google: 300 ms
- Facebook: 1667 ms
- Twitter: 1492 ms
- YouTube: 1614 ms
- Stackoverflow: 3615 ms 


#### Video of successful execution: 
1) Fast website load testing: https://drive.google.com/file/d/1Q1gsqTCdlaokhjQW2YXcaUin6ic7zUek/
2) Slow website load testing: https://drive.google.com/file/d/1HAZ3JwmJVj2eRd84Kb7Wsq9ldksB-w_f/ 
