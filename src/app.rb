require 'sinatra/base'
require 'sinatra/reloader'

class App < Sinatra::Base
  nav = [
      ["/duplicate-tab", "Duplicate Tab", "2017/12/28"],
      ["/building", "Building this site", "2017/09/04"]
    ]

  get '/' do
    @nav = nav
    erb :'index'
  end

  get '/*' do
    @nav = nav
    path = params[:splat].first
    erb :"/#{path}"
  end
end
