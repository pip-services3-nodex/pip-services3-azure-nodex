# <img src="https://uploads-ssl.webflow.com/5ea5d3315186cf5ec60c3ee4/5edf1c94ce4c859f2b188094_logo.svg" alt="Pip.Services Logo" width="200">
<br/> Azure specific components for Node.js / ES2017 Changelog

## <a name="1.1.0"></a> 1.1.0 (2023-03-01)

### Breaking changes
* Renamed descriptors for services:
    - "\*:service:azure-function\*:1.0" -> "\*:service:azurefunc\*:1.0"
    - "\*:service:commandable-azure-function\*:1.0" -> "\*:service:commandable-azurefunc\*:1.0"

### Features
- Updated dependencies

## <a name="1.0.4"></a> 1.0.4 (2022-09-08)

### Bug fixes
* Fixed validation connection params

## <a name="1.0.3"></a> 1.0.3 (2022-09-07)

### Features
* Added interceptors by command or regex
* Added more configs for clients

## <a name="-1.0.1-1.0.2"></a> 1.0.1-1.0.2 (2022-03-09)

### Bug Fixes
- Fixed imports 
- Fixed schemas validation
- Fixed error processiong
- Fixed docs


## <a name="1.0.0"></a> 1.0.0 (2022-03-07)

### Features
- **clients** - client components for working with Azure cloud Functions.
- **connect** - components for installation and connection settings.
- **containers** - contains classes that act as containers to instantiate and run components.
- **services** - contains interfaces and classes used to create services that do operations via the Azure Function protocol.