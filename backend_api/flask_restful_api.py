from flask import Flask, request
from flask_restful import Resource, Api

import numpy as np
import matplotlib.pyplot as plt
import mpld3


app = Flask(__name__)
api = Api(app)


class PlotDataPoint(Resource):
    def __init__(self):
        super().__init__()
        self.data_to_plot = np.array([])

    def get(self, num):
        # Append new data point to array
        self.data_to_plot = np.append(self.data_to_plot, num)
        # Make figure and plot data
        fig = plt.figure()
        plt.plot(self.data_to_plot, 'ks-', mec='w', mew=5, ms=20)
        # Export figure to html
        fig_html = mpld3.fig_to_html(fig)
        return {'figure': fig_html}

    def post(self):
        post_json = request.get_json()
        return {'you sent': post_json}, 201


class MultiplicateData(Resource):
    def get(self, num):
        print('result: ', num*10)
        return {'result': num*10, 'another_key': 'javaporco'}

    def post(self, num):
        return {'result': num*10}, 201


api.add_resource(PlotDataPoint, '/plotdatapoint/<int:num>')
api.add_resource(MultiplicateData, '/multiplicate/<int:num>')


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
