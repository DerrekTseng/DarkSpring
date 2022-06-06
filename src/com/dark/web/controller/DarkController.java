package com.dark.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping
public class DarkController {

	@GetMapping
	public ModelAndView index() {
		ModelAndView view = new ModelAndView("index");
		return view;
	}
	
	@GetMapping("dashboard")
	public ModelAndView dashboard() {
		ModelAndView view = new ModelAndView("dashboard");
		return view;
	}
	
	
	
}
