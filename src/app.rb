require 'sinatra/base'
require 'sinatra/reloader'

class App < Sinatra::Base
  nav = [
      ["/building", "Building this site", "2017/09/04"]
    ]

  get '/' do
    @nav = nav
    erb :'index'
  end

  get '/building' do
    @nav = nav
    erb :'building'
  end
end
