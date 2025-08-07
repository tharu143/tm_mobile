# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

a = Analysis(
    ['app.py'],
    pathex=['C:\\manoj\\retail'],
    binaries=[
        ('mongodb-binaries/mongod.exe', 'mongodb-binaries')
    ],
    datas=[
        ('Uploads', 'Uploads'),
        ('dist', 'dist'),
        ('LICENSE.txt', '.')
    ],
    hiddenimports=[
        'pymongo', 'gridfs', 'bson', 'werkzeug.utils', 'openpyxl', 'flask_cors',
        'flask', 'jinja2', 'waitress', 'et_xmlfile', 'charset_normalizer', 'certifi',
        'dns.rdata', 'packaging', 'platformdirs', 'wheel', 'zipp', 'importlib_metadata',
        'more_itertools', 'jaraco.text', 'jaraco.functools', 'jaraco.context',
        'backports.tarfile', 'tomli'
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=['tkinter', 'PyQt5', 'numpy'],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='flask_server',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='flask_server'
)