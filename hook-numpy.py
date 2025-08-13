# hook-numpy.py
from PyInstaller.utils.hooks import collect_submodules, collect_data_files

hiddenimports = collect_submodules('numpy')
datas = collect_data_files('numpy')
# Explicitly include multiarray to ensure proper initialization
hiddenimports.append('numpy.core.multiarray')
hiddenimports.append('numpy.core._multiarray_umath')