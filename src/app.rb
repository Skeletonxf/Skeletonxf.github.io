require 'sinatra/base'
require 'sinatra/reloader'

class App < Sinatra::Base
  get '/' do
    erb :'index'
  end
end
