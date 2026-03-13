# utils/general.py
from pathlib import Path

def update_options(request):
    """
    Parse request args for YOLO inference.
    Returns:
        source: str or Path to the image
        save_txt: bool (whether to save results as txt)
    """
    source = None
    save_txt = False

    if request.method == 'GET':
        # optional: parse query parameters
        source = request.args.get("source")
        save_txt = request.args.get("save_txt") == 'T'
    elif request.method == 'POST':
        save_txt = request.form.get("save_txt") == 'T'
        # source will be set in predict_api.py when file is uploaded
        source = None

    return source, save_txt