; extra.nsh - NSIS Installer Script for RetailApp

; Define application constants
!define APP_NAME "RetailApp"
!define APP_VERSION "1.0.0"
!define COMPANY_NAME "Your Company"
!define TEMP_DIR "$APPDATA\${APP_NAME}Temp"
!define INSTALLER_ICON "public\tmt-logo.ico"

; Request admin privileges for installation
RequestExecutionLevel admin

; Include necessary NSIS plugins and logic
!include "MUI2.nsh"
!include "LogicLib.nsh"
!include "FileFunc.nsh"
!include "WinMessages.nsh"

; Modern UI definitions
!define MUI_ABORTWARNING
!define MUI_ICON "${INSTALLER_ICON}"
!define MUI_UNICON "${INSTALLER_ICON}"

; Custom macro for initialization
!macro customInit
  ; Initialize the plugins directory
  InitPluginsDir

  ; Create a temporary directory in AppData
  CreateDirectory "${TEMP_DIR}"

  ; Check if the temporary directory was created successfully
  ${If} ${FileExists} "${TEMP_DIR}"
    DetailPrint "Created temporary directory: ${TEMP_DIR}"
  ${Else}
    MessageBox MB_OK|MB_ICONEXCLAMATION "Failed to create temporary directory at ${TEMP_DIR}. Please ensure you have write permissions in $APPDATA."
    Abort
  ${EndIf}
!macroend

; Custom macro for installation steps
!macro customInstall
  ; Set the output path to the installation directory
  SetOutPath "$INSTDIR"

  ; Create additional directories for logs, backups, and uploads
  CreateDirectory "$INSTDIR\logs"
  CreateDirectory "$INSTDIR\backups"
  CreateDirectory "$INSTDIR\Uploads"

  ; Copy extra resources (MongoDB binaries, Flask server, etc.)
  File /r "mongodb-binaries\mongod.exe"
  File /r "flask_server\flask_server.exe"
  File /r "flask_server\dist\*.*"
  File /r "Uploads\*.*"
  File "LICENSE.txt"
  File "${INSTALLER_ICON}"

  ; Verify that critical files were copied
  ${If} ${FileExists} "$INSTDIR\mongodb-binaries\mongod.exe"
    DetailPrint "Successfully copied MongoDB binaries."
  ${Else}
    MessageBox MB_OK|MB_ICONEXCLAMATION "Failed to copy MongoDB binaries. Installation may be incomplete."
  ${EndIf}

  ${If} ${FileExists} "$INSTDIR\flask_server\flask_server.exe"
    DetailPrint "Successfully copied Flask server."
  ${Else}
    MessageBox MB_OK|MB_ICONEXCLAMATION "Failed to copy Flask server. Installation may be incomplete."
  ${EndIf}

  ; Set permissions for the installation directory
  AccessControl::GrantOnFile "$INSTDIR" "(BU)" "FullAccess"

  ; Log success or handle errors
  ${If} ${Errors}
    MessageBox MB_OK|MB_ICONEXCLAMATION "Error setting up installation directories. Please ensure you have sufficient disk space and write permissions."
    Abort
  ${Else}
    DetailPrint "Installation directories and files set up successfully."
  ${EndIf}
!macroend

; Custom macro for cleanup after installation
!macro customUnInit
  ; Clean up the temporary directory
  ${If} ${FileExists} "${TEMP_DIR}"
    RMDir /r "${TEMP_DIR}"
    DetailPrint "Cleaned up temporary directory: ${TEMP_DIR}"
  ${Else}
    DetailPrint "Temporary directory ${TEMP_DIR} does not exist, skipping cleanup."
  ${EndIf}
!macroend

; Custom macro for uninstallation
!macro customUninstall
  ; Remove additional directories
  RMDir /r "$INSTDIR\logs"
  RMDir /r "$INSTDIR\backups"
  RMDir /r "$INSTDIR\Uploads"
  RMDir /r "$INSTDIR\mongodb-binaries"
  RMDir /r "$INSTDIR\flask_server"
  Delete "$INSTDIR\LICENSE.txt"
  Delete "$INSTDIR\tmt-logo.ico"

  ; Remove the installation directory if empty
  RMDir "$INSTDIR"

  ; Clean up the temporary directory
  RMDir /r "${TEMP_DIR}"

  ; Log uninstallation steps
  ${If} ${FileExists} "$INSTDIR"
    DetailPrint "Warning: Installation directory $INSTDIR was not fully removed."
  ${Else}
    DetailPrint "Successfully removed installation directory."
  ${EndIf}
!macroend

; Prompt user before installation
Function .onInit
  ; Display a Yes/No prompt to confirm installation
  MessageBox MB_YESNO|MB_ICONQUESTION "Do you want to install ${APP_NAME} version ${APP_VERSION}?" IDYES NoAbort
    Abort
  NoAbort:

  ; Check for existing installation
  ${If} ${FileExists} "$INSTDIR\${APP_NAME}.exe"
    MessageBox MB_YESNO|MB_ICONQUESTION "A previous installation of ${APP_NAME} was found. Would you like to overwrite it?" IDYES ContinueInstall
      Abort
    ContinueInstall:
  ${EndIf}

  ; Verify sufficient disk space (500 MB assumed)
  ${DriveSpace} "$INSTDIR" "/D=F /S=M" $R0
  ${If} $R0 < 500
    MessageBox MB_OK|MB_ICONEXCLAMATION "Insufficient disk space on the target drive. At least 500 MB is required."
    Abort
  ${EndIf}
FunctionEnd

; Post-installation steps
Function .onInstSuccess
  DetailPrint "${APP_NAME} was successfully installed."
  MessageBox MB_OK|MB_ICONINFORMATION "${APP_NAME} has been installed successfully."
FunctionEnd

; Uninstaller initialization
Function un.onInit
  MessageBox MB_YESNO|MB_ICONQUESTION "Are you sure you want to uninstall ${APP_NAME}?" IDYES NoAbortUninst
    Abort
  NoAbortUninst:
FunctionEnd

; Post-uninstallation steps
Function un.onUninstSuccess
  DetailPrint "${APP_NAME} was successfully uninstalled."
  MessageBox MB_OK|MB_ICONINFORMATION "${APP_NAME} has been uninstalled successfully."
FunctionEnd