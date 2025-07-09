# Think2Code

## Some commonly used commands
```
dotnet new sln --name Think2Code.DotNet --output DotNet
dotnet new mvc -n Samples.Mvc
dotnet sln Think2Code.DotNet.sln add Samples.Mvc/Samples.Mvc.csproj
```

```
dotnet publish -c Release -o ./publish
cd publish
dotnet publish/Samples.Mvc.dll
```